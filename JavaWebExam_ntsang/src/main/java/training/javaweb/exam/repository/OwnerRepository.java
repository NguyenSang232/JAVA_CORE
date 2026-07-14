package training.javaweb.exam.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import training.javaweb.exam.dto.response.OwnerDTO;
import training.javaweb.exam.entity.Owner;
import training.javaweb.exam.mapper.OwnerMapper;

@Repository
public class OwnerRepository {

	@Autowired
	private OwnerMapper ownerMapper;

	public void insert(Owner owner) {
		ownerMapper.insert(owner);
	}

	public List<OwnerDTO> findAll() {
		return ownerMapper.findAll();
	}

	public OwnerDTO findDetail(Long id) {
		return ownerMapper.findDetail(id);
	}

	public OwnerDTO findDTOById(Long id) {
		return ownerMapper.findDTOById(id);
	}

	public void update(Owner owner) {
		ownerMapper.update(owner);
	}

	public List<OwnerDTO> search(String keyword) {
		return ownerMapper.search(keyword);
	}

	public void softDelete(Long id) {
		ownerMapper.softDelete(id);
	}

}